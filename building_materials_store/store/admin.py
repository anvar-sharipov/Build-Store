from django.contrib import admin
from . models import *

class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'sku', 'quantity',
        'purchase_price', 'retail_price', 'wholesale_price',
        'unit_of_measurement', 'category'
    )
    search_fields = ('name', 'sku')
    list_filter = ('category', 'unit_of_measurement')
    autocomplete_fields = ['unit_of_measurement', 'category']
    ordering = ('name',)


admin.site.register(Product, ProductAdmin)


class UnitOfMeasurementAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)


admin.site.register(UnitOfMeasurement, UnitOfMeasurementAdmin)


class CategoryAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)


admin.site.register(Category, CategoryAdmin)


class ClientAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)


admin.site.register(Client, ClientAdmin)


class SupplierAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)


admin.site.register(Supplier, SupplierAdmin)


class DriverAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)


admin.site.register(Driver, DriverAdmin)


class FakturaProductInline(admin.TabularInline):
    model = FakturaProduct
    extra = 1
    autocomplete_fields = ['product']


class FakturaAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'faktura_type', 'client', 'supplier', 'driver', 'date', 'total_amount'
    )
    list_filter = ('faktura_type', 'date', 'client', 'supplier')
    search_fields = ('description',)
    date_hierarchy = 'date'
    inlines = [FakturaProductInline]
    autocomplete_fields = ['client', 'supplier', 'driver']
    readonly_fields = ['total_amount']

    def total_amount(self, obj):
        return obj.total_amount()
    total_amount.short_description = 'Jemi baha'


admin.site.register(Faktura, FakturaAdmin)
