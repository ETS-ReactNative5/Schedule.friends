# Generated by Django 3.2.7 on 2021-10-06 06:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sf_users', '0010_auto_20211005_0822'),
    ]

    operations = [
        migrations.AlterField(
            model_name='day',
            name='user',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='schedule', to='sf_users.user'),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
