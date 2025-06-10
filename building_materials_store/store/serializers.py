from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    # unit_of_measurement = serializers.StringRelatedField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'quantity', 'purchase_price', 'retail_price', 'wholesale_price', 'description', 'category']




class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name']



class PartnerSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    class Meta:
        model = Partner
        fields = ['id', 'name', 'type', 'type_display']


