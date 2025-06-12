from django.shortcuts import render
import time

# Create your views here.
from rest_framework import viewsets
from .models import *
from .serializers import *

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        "username": user.username,
        "photo": request.build_absolute_uri(user.photo.url) if user.photo else None
    })






class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



class PartnerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Partner.objects.all().order_by('-pk')
    serializer_class = PartnerSerializer

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     return Response(
    #         {
    #             'message': 'partnerAdded',
    #             'partner': serializer.data
    #         },
    #         status=status.HTTP_201_CREATED
    #     )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # time.sleep(2)
        self.perform_destroy(instance)
        return Response(
            {"message": "partnerDeleted"},
            status=status.HTTP_204_NO_CONTENT
        )
    

    def update(self, request, *args, **kwargs):
        time.sleep(2)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data) # res.data
    
        # return Response({
        #     "message": "partnerUpdated",
        #     "data": serializer.data
        # }) # res.data.data
    
   

        



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Пользователь создан'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializers

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'message': 'groupAdded',
                'group': serializer.data
            },
            status=status.HTTP_201_CREATED
        )

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all().order_by('-pk')
    serializer_class = SupplierSerializer

    
    def destroy(self, request, *args, **kwargs):
        # return Response(
        #         {'message': 'supplierHasSupplies'},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'supplierDeleted'}, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        # Здесь можно обработать событие "добавления"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        time.sleep(2)

        # # Возвращаем кастомный ответ (например, сообщение и сам объект)
        # return Response(
        #     {
        #         'message': 'supplierAdded',
        #         'supplier': serializer.data
        #     },
        #     status=status.HTTP_201_CREATED
        # )
    



class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    queryset = Employee.objects.all().order_by('-pk')
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        # Можно вставить задержку или лог
        time.sleep(2)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {
                'message': 'employeeAdded',
                'employee': serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        # time.sleep(2)
        # return Response(
        #         {'message': 'employeeNotDeleted'},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        time.sleep(2)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    


# @api_view(['GET', 'POST'])
# def suppliers_list(request):
#     if request.method == 'GET':
#         suppliers = Supplier.objects.all()
#         serializer = SupplierSerializer(suppliers, many=True)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = SupplierSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class MySecureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.groups.filter(name="admin").exists():
            return Response({"authUser": f"{request.user}", "authGroup": "admin"})
        elif user.groups.filter(name="worker").exists():
            return Response({"authUser": f"{request.user}", "authGroup": "worker"})
        else:
            return Response({"message": "Нет доступа"}, status=403)