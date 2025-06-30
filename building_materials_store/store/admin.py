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




class ModelInline(admin.TabularInline):
    model = Model
    extra = 1
    show_change_link = True


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    inlines = [ModelInline]


@admin.register(Model)
class ModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'brand')
    list_filter = ('brand',)
    search_fields = ('name', 'brand__name')


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="100" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Превью"


class ProductBatchInline(admin.TabularInline):
    model = ProductBatch
    extra = 1


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'alt_text', 'image_preview')
    search_fields = ('product__name', 'alt_text')

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="100" />'
        return "-"
    image_preview.allow_tags = True
    image_preview.short_description = "Превью"


@admin.register(ProductBatch)
class ProductBatchAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'product', 'batch_number', 'quantity',
        'arrival_date', 'production_date', 'expiration_date'
    )
    list_filter = ('arrival_date', 'expiration_date', 'product')
    search_fields = ('product__name', 'batch_number')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)









    
@admin.register(UnitOfMeasurement)
class UnitOfMeasurementAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


class ProductUnitInline(admin.TabularInline):
    model = ProductUnit
    extra = 1
    autocomplete_fields = ('unit',)
    fields = ('unit', 'conversion_factor', 'is_default_for_sale')
    verbose_name = "Alternatiw ölçeg"
    verbose_name_plural = "Alternatiw ölçegler"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'base_unit', 'wholesale_price', 'retail_price', 'quantity')
    search_fields = ('name',)
    autocomplete_fields = ('base_unit',)
    inlines = [ProductUnitInline]



@admin.register(PriceChangeHistory)
class PriceChangeHistoryAdmin(admin.ModelAdmin):
    list_display = (
        'product', 
        'price_type', 
        'old_price', 
        'new_price', 
        'difference', 
        'quantity_at_change', 
        'changed_by', 
        'changed_at'
    )
    list_filter = ('price_type', 'changed_by', 'changed_at')
    search_fields = ('product__name', 'changed_by__username')
    readonly_fields = ('difference', 'changed_at')
    ordering = ('-changed_at',)
    fieldsets = (
        (None, {
            'fields': (
                'product', 'price_type', 'old_price', 'new_price', 
                'quantity_at_change', 'difference', 'changed_by', 
                'changed_at', 'notes'
            )
        }),
    )








        

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
