from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    photo = models.ImageField(upload_to='user_photos/', null=True, blank=True, default='images/avatar.png')



# Обязательные поля:
# name — название товара (например, "Цемент М500", "Краска белая")
# quantity (количество) — сколько единиц товара есть на складе
# price — цена за единицу товара
# unit_of_measurement (единица измерения) — литры, килограммы, штуки, мешки и т.п.литры, килограммы, штуки, мешки и т.п.


# Рекомендуемые дополнительные поля:
# description — описание товара (технические характеристики, назначение)
# category — категория товара (цементы, краски, пиломатериалы и т.п.), для удобной фильтрации
# supplier — поставщик товара (название компании или ссылка на таблицу поставщиков)
# sku (артикул) — уникальный код товара для учета и поиска
# weight — вес единицы товара (если важен для логистики)
# dimensions — габариты (если нужно учитывать объем или размеры для склада/доставки)
# date_added — дата добавления товара в систему
# expiration_date — срок годности (если применимо, например, для химии)
# photo_url или image — фото товара для интерфейса

# Русский	        Туркменский
# товар	            haryt
# товары (мн.ч.)	harytlar
# единица измерения	ölçeg birligi
# единицы измерения	ölçeg birlikleri
# категория	        kategoriýa
# категории (мн.ч.)	kategoriýalar
# название	        ady
# артикул	        artikul
# количество	    mukdar
# цена	            baha
# описание	        beýany
# единица измерения	ölçeg birligi
# категория	        kategoriýa


class Product(models.Model):
    name = models.CharField(verbose_name='harytyn ady', max_length=1000)
    sku = models.CharField(verbose_name='artikul', max_length=250, unique=True, blank=True, null=True)
    quantity = models.DecimalField(verbose_name='mukdary', max_digits=10, decimal_places=2)
    purchase_price = models.DecimalField(verbose_name='sena pokupki', max_digits=10, decimal_places=2, default=0)
    retail_price = models.DecimalField(verbose_name='sena prodaji', max_digits=10, decimal_places=2, default=0)
    wholesale_price = models.DecimalField(verbose_name='sena optom', max_digits=10, decimal_places=2, default=0)
    unit_of_measurement = models.ForeignKey(
        'UnitOfMeasurement',
        verbose_name='ölçeg birligi',
        on_delete=models.PROTECT
    )
    description = models.TextField(verbose_name='beýany', blank=True)
    category = models.ForeignKey(
        'Category',
        verbose_name='kategoriýa',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit_of_measurement})"

    class Meta:
        verbose_name = 'haryt'
        verbose_name_plural = 'harytlar'




class UnitOfMeasurement(models.Model):
    name = models.CharField(verbose_name='ölçeg birligi', max_length=20, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'ölçeg birligi'
        verbose_name_plural = 'ölçeg birlikleri'





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



# Udalit potom
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
    
    type = models.CharField(
        max_length=20,
        choices=PARTNER_TYPE_CHOICES,
        default=SUPPLIER,
        verbose_name='Partneriň görnüşi',
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

