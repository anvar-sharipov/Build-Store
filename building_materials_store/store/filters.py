from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
import django_filters
from .models import *

# Для фильтрации по списку значений (например, ?categories=1,2)
class NumberInFilter(django_filters.BaseInFilter, django_filters.NumberFilter):
    pass

class ProductFilter(django_filters.FilterSet):
    categories = NumberInFilter(field_name='category__id', lookup_expr='in')
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    wholesale_price_min = django_filters.NumberFilter(field_name='wholesale_price', lookup_expr='gte')
    wholesale_price_max = django_filters.NumberFilter(field_name='wholesale_price', lookup_expr='lte')

    retail_price_min = django_filters.NumberFilter(field_name='retail_price', lookup_expr='gte')
    retail_price_max = django_filters.NumberFilter(field_name='retail_price', lookup_expr='lte')

    ordering = django_filters.OrderingFilter(
        fields=(
            ('wholesale_price', 'wholesale_price'),
            ('retail_price', 'retail_price'),
            ('name', 'name'),
        ),
    )

    # 🔍 Добавляем общий search
    search = django_filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        return queryset.annotate(
            similarity=TrigramSimilarity('name', value)
        ).filter(similarity__gt=0.3).order_by('-similarity')

    class Meta:
        model = Product
        fields = []
