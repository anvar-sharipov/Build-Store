from django.db import models, IntegrityError, transaction
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from decimal import Decimal








class CustomUser(AbstractUser):
    photo = models.ImageField(upload_to='user_photos/', null=True, blank=True, default='images/avatar.png')


User = get_user_model()









class UnitOfMeasurement(models.Model):
    name = models.CharField(max_length=100, verbose_name="Наименование")  # Например: "литр", "банка", "коробка"

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Единица измерения'
        verbose_name_plural = 'Единицы измерения'



class Product(models.Model):
    name = models.CharField(verbose_name='Наименование', max_length=1000)
    description = models.TextField(verbose_name='Описание', blank=True, null=True)

    base_unit = models.ForeignKey('UnitOfMeasurement', verbose_name='Базовая единица', on_delete=models.PROTECT)
    category = models.ForeignKey('Category', verbose_name='Категория', on_delete=models.PROTECT, blank=True, null=True)

    sku = models.CharField(verbose_name='Артикул (SKU)', max_length=100, unique=True, null=True, blank=True)
    qr_code = models.CharField(verbose_name='QR-код', max_length=1000, blank=True, null=True, unique=True)

    quantity = models.DecimalField(verbose_name='Количество', max_digits=10, decimal_places=2, default=0)

    purchase_price = models.DecimalField(verbose_name='Цена закупки', max_digits=10, decimal_places=2, default=0)
    retail_price = models.DecimalField(verbose_name='Розничная цена', max_digits=10, decimal_places=2, default=0)
    wholesale_price = models.DecimalField(verbose_name='Оптовая цена', max_digits=10, decimal_places=2, default=0)
    discount_price = models.DecimalField(verbose_name='Цена со скидкой', max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Poprosil Makem aga sdelat porogowuyu senu (purchase_price) esho odnu, ne ponyal pochemu no sdelayu raz poprosili
    firma_price = models.DecimalField(verbose_name='Цена Firma', max_digits=10, decimal_places=2, blank=True, null=True)

    brand = models.ForeignKey('Brand', verbose_name='Бренд', on_delete=models.PROTECT, blank=True, null=True)
    model = models.ForeignKey('Model', verbose_name='Модель', on_delete=models.PROTECT, blank=True, null=True)

    weight = models.DecimalField(verbose_name='Вес (кг)', max_digits=10, decimal_places=3, blank=True, null=True)

    volume = models.DecimalField(verbose_name='Объём (м³)', max_digits=10, decimal_places=4, blank=True, null=True)
    length = models.DecimalField(verbose_name='Длина (см)', max_digits=10, decimal_places=2, blank=True, null=True)
    width = models.DecimalField(verbose_name='Ширина (см)', max_digits=10, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(verbose_name='Высота (см)', max_digits=10, decimal_places=2, blank=True, null=True)

    is_active = models.BooleanField(verbose_name='Активен', default=True)
    created_at = models.DateTimeField(verbose_name='Создан', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='Обновлён', auto_now=True)

    tags = models.ManyToManyField('Tag', verbose_name='Теги', blank=True)


    # def clean(self):
    #     super().clean()
    #     if not self.sku:
    #         raise ValidationError({'sku': 'Артикул (SKU) должен быть заполнен.'})
    #     if not self.qr_code:
    #         raise ValidationError({'qr_code': 'QR-код должен быть заполнен.'})


    # В модели Product добавь __init__, чтобы запомнить старые цены при загрузке:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._original_purchase_price = self.purchase_price
        self._original_retail_price = self.retail_price
        self._original_wholesale_price = self.wholesale_price
        self._original_discount_price = self.discount_price

        


    def save(self, *args, user=None, **kwargs):
        self._current_user = user
        if not self.sku:
            for _ in range(10):  # Попытки сгенерировать уникальный sku
                last_id = Product.objects.order_by('-id').first()
                next_id = (last_id.id + 1) if last_id else 1
                self.sku = f"PRD{str(next_id).zfill(4)}"

                if not self.qr_code:
                    self.qr_code = self.sku

                try:
                    with transaction.atomic():
                        # self.full_clean()  # Проверка, что sku и qr_code теперь валидны
                        super().save(*args, **kwargs)
                    return
                except IntegrityError:
                    # Если sku уже существует, пробуем с новым next_id
                    continue
            raise Exception("Не удалось сохранить товар после 10 попыток")
        else:
            if not self.qr_code:
                self.qr_code = self.sku
            # self.full_clean()  # Проверка перед сохранением
            super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'





class PriceChangeHistory(models.Model):
    PRICE_TYPE_CHOICES = [
        ('purchase', 'Цена закупки'),
        ('retail', 'Розничная цена'),
        ('wholesale', 'Оптовая цена'),
        ('discount', 'Цена со скидкой'),
    ]

    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='price_changes')
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES, verbose_name='Тип цены')
    old_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Старая цена')
    new_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Новая цена')
    quantity_at_change = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Количество на складе')
    difference = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Прибыль/Убыток', editable=False)
    changed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, verbose_name='Кто изменил')
    changed_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата изменения')
    notes = models.TextField(blank=True, null=True, verbose_name='Комментарий')



    class Meta:
        verbose_name = 'История изменения цены'
        verbose_name_plural = 'История изменения цен'
        ordering = ['-changed_at']
        indexes = [
            models.Index(fields=['product', 'price_type']),
        ]

    def save(self, *args, **kwargs):
        self.difference = (self.new_price - self.old_price) * self.quantity_at_change
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} | {self.get_price_type_display()}: {self.old_price} → {self.new_price} (Δ {self.difference})"




class FreeProduct(models.Model):
    main_product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='free_items',
        verbose_name='Основной товар'
    )
    gift_product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='used_as_free',
        verbose_name='Бесплатный товар'
    )
    quantity_per_unit = models.DecimalField(
        verbose_name='Количество на единицу основного товара',
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        verbose_name = 'Бесплатный товар'
        verbose_name_plural = 'Бесплатные товары'

    def __str__(self):
        return f"{self.quantity_per_unit} x {self.gift_product.name} к {self.main_product.name}"




class Brand(models.Model):
    name = models.CharField(verbose_name='Бренд', max_length=255, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Бренд'
        verbose_name_plural = 'Бренды'


class Model(models.Model):
    brand = models.ForeignKey(Brand, verbose_name='Бренд', on_delete=models.CASCADE)
    name = models.CharField(verbose_name='Модель', max_length=255)

    def __str__(self):
        return f"{self.brand.name} - {self.name}"

    class Meta:
        verbose_name = 'Модель'
        verbose_name_plural = 'Модели'
        unique_together = ('brand', 'name')


def product_image_path(instance, filename):
    return f'products/{instance.product.id}/{filename}'

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, verbose_name='Товар')
    image = models.ImageField(upload_to=product_image_path, verbose_name='Изображение')
    alt_text = models.CharField(max_length=255, blank=True, null=True, verbose_name='Альтернативный текст')

    class Meta:
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'


# dlya ucheta sroka godnosti towara
class ProductBatch(models.Model):
    product = models.ForeignKey(
        Product, 
        related_name='batches', 
        on_delete=models.CASCADE,
        verbose_name='Товар'
    )

    batch_number = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name='Номер партии'
    )

    quantity = models.PositiveIntegerField(
        verbose_name='Количество в партии'
    )

    arrival_date = models.DateField(
        blank=True, 
        null=True, 
        verbose_name='Дата прихода'
    )

    production_date = models.DateField(
        blank=True, 
        null=True, 
        verbose_name='Дата производства'
    )

    expiration_date = models.DateField(
        blank=True, 
        null=True, 
        verbose_name='Срок годности'
    )

    def __str__(self):
        return f"{self.product.name} — партия {self.batch_number or 'без номера'}"

    class Meta:
        verbose_name = 'Партия товара'
        verbose_name_plural = 'Партии товаров'
 

#  Пример «4K», «LED», «Скидка» «Новинка», «Эко», «Популярное».
class Tag(models.Model):
    name = models.CharField(verbose_name='Тег', max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'


class ProductUnit(models.Model):
    product = models.ForeignKey(Product, related_name='units', on_delete=models.CASCADE)
    unit = models.ForeignKey(UnitOfMeasurement, on_delete=models.PROTECT)
    conversion_factor = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        help_text="Сколько базовых единиц в 1 этой единице (напр: 1 банка = 18 литров → 18)"
    )
    is_default_for_sale = models.BooleanField(default=False, help_text="Основная единица для продажи")

    def __str__(self):
        return f"{self.product.name} - {self.unit.name} ({self.conversion_factor} {self.product.base_unit.name})"

    class Meta:
        verbose_name = 'ölçeg görnüşi'
        verbose_name_plural = 'ölçeg görnüşleri'
        unique_together = ('product', 'unit')





# class UnitOfMeasurement(models.Model):
#     name = models.CharField(verbose_name='ölçeg birligi', max_length=20, unique=True)

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = 'ölçeg birligi'
#         verbose_name_plural = 'ölçeg birlikleri'





class Category(models.Model):
    name = models.CharField(verbose_name='kategoriýa', max_length=250, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'kategoriýa'
        verbose_name_plural = 'kategoriýalar'






# class Client(models.Model):
#     name = models.CharField(verbose_name='Müşderiniň ady', max_length=2000)

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = 'Müşderi'
#         verbose_name_plural = 'Müşderiler'



class Agent(models.Model):
    name = models.CharField(verbose_name='Agent', max_length=2000)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Agent'
        verbose_name_plural = 'Agentler'





class Partner(models.Model):
    BUYER = 'klient'
    SUPPLIER = 'supplier'
    BOTH = 'both'

    PARTNER_TYPE_CHOICES = [
        (BUYER, 'Alyjy (Покупатель)'),
        (SUPPLIER, 'Üpjünçi (Поставщик)'),
        (BOTH, 'Alyjy we Üpjünçi (Покупатель и поставщик)'),
    ]

    name = models.CharField(verbose_name='Partneryn ady', max_length=2000)
    # СВЯЗЬ С AGENT
    agent = models.ForeignKey(
        'Agent',
        on_delete=models.PROTECT,  # или CASCADE, если хочешь удалять партнёра при удалении агента
        null=True,
        blank=True,
        verbose_name='Agent'
    )
    type = models.CharField(
        max_length=20,
        choices=PARTNER_TYPE_CHOICES,
        default=SUPPLIER,
        verbose_name='Partneriň görnüşi',
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Balans (deb/kred)'
    )

    def __str__(self):
        return f'{self.name} ({self.get_type_display()})'

    class Meta:
        verbose_name = 'Partner'
        verbose_name_plural = 'Partnerler'







class Employee(models.Model):
    name = models.CharField(verbose_name='Işgär', max_length=2000)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Işgär'
        verbose_name_plural = 'Işgärler'


# class Driver(models.Model):
#     name = models.CharField(verbose_name='Sürüjiniň ady', max_length=2000)

#     def __str__(self):
#         return self.name

#     class Meta:
#         verbose_name = 'Sürüji'
#         verbose_name_plural = 'Sürüjiler'

    



# class Faktura(models.Model):
    
#     TYPE_CHOICES = [
#         (1, 'Girdeji'),   # Входящий
#         (2, 'Çykyjy'),    # Исходящий
#         (3, 'Wozwrat'),   # Возврат
#     ]

#     faktura_type = models.PositiveSmallIntegerField(
#         verbose_name='Faktura görnüşi',
#         choices=TYPE_CHOICES,
#         default=1,
#     )

#     client = models.ForeignKey(
#         Client,
#         verbose_name='Müşderi',  # Клиент
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True
#     )
#     supplier = models.ForeignKey(
#         Supplier,
#         verbose_name=' üpjünçi',  # Поставщик
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True
#     )
#     driver = models.ForeignKey(
#         Driver,
#         verbose_name=' sürüji',  # Водитель
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True
#     )

#     description = models.TextField(verbose_name='beýany', blank=True)

#     date = models.DateTimeField(verbose_name='Senesi')

#     def __str__(self):
#         return f"{self.get_faktura_type_display()} - {self.date.strftime('%Y-%m-%d %H:%M')}"
    
#     def total_amount(self):
#         # Сумма всех товаров в этой фактуре (quantity * price)
#         return sum(item.quantity * item.price for item in self.items.all())
    
#     class Meta:
#         verbose_name = 'Faktura'
#         verbose_name_plural = 'Fakturalar'






# class FakturaProduct(models.Model):
#     faktura = models.ForeignKey(Faktura, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.PROTECT)
#     quantity = models.DecimalField(verbose_name='Mukdary', max_digits=10, decimal_places=2)
#     price = models.DecimalField(verbose_name='Baha', max_digits=10, decimal_places=2)

#     def __str__(self):
#         return f"{self.product.name} - {self.quantity} x {self.price}"

#     class Meta:
#         verbose_name = 'Faktura önümi'
#         verbose_name_plural = 'Faktura önümleri'

