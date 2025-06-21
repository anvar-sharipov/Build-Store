from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'agents', AgentViewSet)
router.register(r'employeers', EmployeeViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'groups', GroupViewSet)
# path('groups/', GroupViewSet.as_view()),

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('suppliers/', suppliers_list, name='suppliers_list'),
    path('user/', current_user),
    path('userinfo/', MySecureView.as_view()),
    path('assign-partners/', AssignPartnersToAgentView.as_view(), name='assign_partners'),
    
]

