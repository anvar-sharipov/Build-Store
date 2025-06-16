from django.shortcuts import render
import time
from django.http import HttpResponse
import openpyxl
from openpyxl.utils import get_column_letter
from icecream import ic


from rest_framework import viewsets, status, filters
from .models import *
from .serializers import *

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, action

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



class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.all().order_by('-pk')
    serializer_class = AgentSerializer

    def list(self, request, *args, **kwargs):
        # time.sleep(1)  # задержка 2 секунды
        return super().list(request, *args, **kwargs)

    
    def destroy(self, request, *args, **kwargs):
        # return Response(
        #         {'message': 'supplierHasSupplies'},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'message': 'AgentDeleted'}, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'data': serializer.data, "type": "success"}, status=status.HTTP_201_CREATED)

 


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Employee.objects.all().order_by('-pk')
    serializer_class = EmployeeSerializer

    # Фильтрация и поиск
    filter_backends = [filters.SearchFilter]
    search_fields = ['name'] # сюда поля для поиска
    # ordering_fields = ['name', 'email', 'id']  # опцио

    def create(self, request, *args, **kwargs):
        # Можно вставить задержку или лог
        # time.sleep(2)

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
    

    @action(detail=False, methods=['get'], url_path='export_excel')
    def export_excel(self, request):
        # применяем поиск/фильтры, как и в list()
        queryset = self.filter_queryset(self.get_queryset())

        # создаем Excel
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Employees"

        # Заголовки
        headers = ["№", "Işgär"]
        ws.append(headers)

        # Строки
        for index, emp in enumerate(queryset, 1):
            ws.append([index, emp.name])

        # Автоширина колонок
        for i, column in enumerate(ws.columns, 1):
            max_len = max(len(str(cell.value)) for cell in column)
            ws.column_dimensions[get_column_letter(i)].width = max_len + 2

        # Отдаём как файл
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=employees.xlsx'
        wb.save(response)
        return response


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