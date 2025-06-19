from django.contrib import admin
from . models import *
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _



@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ("username", "email", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "groups")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("email", "first_name", "last_name", "photo")}),
        (_("Permissions"), {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "password1", "password2", "is_staff", "is_active"),
        }),
    )

    search_fields = ("username", "email")
    ordering = ("username",)


    

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


# class ClientAdmin(admin.ModelAdmin):
#     search_fields = ('name',)
#     list_display = ('name',)
# admin.site.register(Client, ClientAdmin)


class AgentAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)

admin.site.register(Agent, AgentAdmin)


class EmployeeAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    list_display = ('name',)

admin.site.register(Employee, EmployeeAdmin)



@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'agent')  # Показываем имя, тип и агента
    list_filter = ('type', 'agent')                # Фильтрация по типу и агенту
    search_fields = ('name', 'agent__name')        # Поиск по имени партнера и имени агента
    autocomplete_fields = ['agent']                # Автозаполнение для ForeignKey


# class DriverAdmin(admin.ModelAdmin):
#     search_fields = ('name',)
#     list_display = ('name',)
# admin.site.register(Driver, DriverAdmin)


# class FakturaProductInline(admin.TabularInline):
#     model = FakturaProduct
#     extra = 1
#     autocomplete_fields = ['product']


# class FakturaAdmin(admin.ModelAdmin):
#     list_display = (
#         'id', 'faktura_type', 'client', 'supplier', 'driver', 'date', 'total_amount'
#     )
#     list_filter = ('faktura_type', 'date', 'client', 'supplier')
#     search_fields = ('description',)
#     date_hierarchy = 'date'
#     inlines = [FakturaProductInline]
#     autocomplete_fields = ['client', 'supplier', 'driver']
#     readonly_fields = ['total_amount']

#     def total_amount(self, obj):
#         return obj.total_amount()
#     total_amount.short_description = 'Jemi baha'
# admin.site.register(Faktura, FakturaAdmin)
