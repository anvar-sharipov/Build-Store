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
    

class ProductSerializer(serializers.ModelSerializer):
    # unit_of_measurement = serializers.StringRelatedField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'quantity', 'purchase_price', 'retail_price', 'wholesale_price', 'description', 'category']




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