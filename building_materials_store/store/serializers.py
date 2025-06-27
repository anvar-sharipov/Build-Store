from rest_framework import serializers
from .models import *
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs['username'] = attrs['username'].lower()
        attrs['password'] = attrs['password'].lower()
        data = super().validate(attrs)
        data['username'] = self.user.username  # можно вернуть имя пользователя, группу и т.д.
        return data
    







class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ProductUnitSerializer(serializers.ModelSerializer):
    unit_name = serializers.CharField(source='unit.name', read_only=True)
    base_unit_name = serializers.CharField(source='product.base_unit.name', read_only=True)

    class Meta:
        model = ProductUnit
        fields = ['id', 'unit', 'unit_name', 'conversion_factor', 'is_default_for_sale', 'base_unit_name']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


class ModelSerializer(serializers.ModelSerializer):
    brand_obj = BrandSerializer(read_only=True, source='brand')
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all()) 

    class Meta:
        model = Model
        fields = ['id', 'name', 'brand', 'brand_obj']



class UnitOfMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasurement
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']



class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'alt_text', 'image' ]


class ProductBatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBatch
        fields = ['id', 'batch_number', 'quantity', 'arrival_date', 'production_date', 'expiration_date']


class ProductSerializer(serializers.ModelSerializer):
    category_name_obj = CategorySerializer(read_only=True, source='category')
    base_unit_obj = UnitOfMeasurementSerializer(read_only=True, source='base_unit')
    brand_obj = BrandSerializer(read_only=True, source='brand')
    model_obj = ModelSerializer(read_only=True, source='model')
    tags_obj = TagSerializer(many=True, read_only=True, source='tags')

    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, write_only=True, required=False)
    base_unit = serializers.PrimaryKeyRelatedField(queryset=UnitOfMeasurement.objects.all(), write_only=True)
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all(), write_only=True, required=False, allow_null=True)
    model = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all(), write_only=True, required=False, allow_null=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, required=False, allow_null=True)


    units = ProductUnitSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    batches = ProductBatchSerializer(many=True, read_only=True)
    

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'sku', 'qr_code',
            'quantity', 'purchase_price', 'retail_price', 'wholesale_price', 'discount_price',
            'weight', 'volume', 'length', 'width', 'height',
            
            'base_unit', 'base_unit_obj',
            'category', 'category_name_obj',
            'brand', 'brand_obj',
            'model', 'model_obj',
            
            'tags', 'tags_obj',
            'units', 'images', 'batches',
            'is_active', 'created_at', 'updated_at'
        ]
        
        
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        product = Product.objects.create(**validated_data)
        product.tags.set(tags_data)
        return product
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', None)
        if tags_data is not None:
            instance.tags.set(tags_data)
        return super().update(instance, validated_data)


    


    











class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    group = serializers.CharField(write_only=True)
    photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'group', 'photo']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("USERNAME_EXISTS")
        return value
    
    def validate_group(self, value):
        if not value:
            raise serializers.ValidationError("EMPTY_GROUP_NAME")
        if not Group.objects.filter(name=value).exists():
            raise serializers.ValidationError("GROUP_NOT_FOUND")
        return value
    
    def validate(self, attrs):
        # Проверка на совпадение паролей
        if attrs['password'].lower() != attrs['password2'].lower():
            raise serializers.ValidationError({"password2": "PASSWORDS_DO_NOT_MATCH"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        group_name = validated_data.pop('group', None)
        username = validated_data.get('username').lower()
        password = validated_data.get('password').lower()

        photo = validated_data.pop('photo', None)
        # user = User.objects.create_user(**validated_data)
        user = User.objects.create_user(username=username, password=password)
        if photo:
            user.photo = photo
            user.save()

        try:
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            raise serializers.ValidationError({'group': 'GROUP_NOT_FOUND'})
        return user
    


class GroupSerializers(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

    

class AgentSerializer(serializers.ModelSerializer):
    partners = serializers.SerializerMethodField()
    class Meta:
        model = Agent
        fields = ['id', 'name', 'partners']

    def get_partners(self, agent):
        partners = Partner.objects.filter(agent=agent)
        return PartnerSerializer(partners, many=True).data


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name']



class PartnerSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    # agent = AgentSerializer(read_only=True)  # для чтения
    agent = serializers.PrimaryKeyRelatedField(read_only=True)
    agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(),
        source='agent',
        write_only=True,
        required=False,       # ✅ не обязательно
        allow_null=True       # ✅ разрешает null
    )
    agent_name = serializers.CharField(source='agent.name', read_only=True)

    class Meta:
        model = Partner
        fields = ['id', 'name', 'type', 'type_display', 'agent', 'agent_id', 'agent_name']










