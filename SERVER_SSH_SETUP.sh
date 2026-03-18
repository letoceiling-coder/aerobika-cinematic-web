#!/bin/bash
# Команды для выполнения на сервере chase.beget.com
# Выполните эти команды на сервере

# Шаг 1: Создать директорию и настроить права
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Шаг 2: Добавить ваш ED25519 ключ (рекомендуется)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICWdK6J93+pq2nOLGOkpiLXPlrDv9WgFT7wQlX6MQ2oL bella-vps-20260308" >> ~/.ssh/authorized_keys

# Шаг 3: Добавить ваш RSA ключ (опционально, для совместимости)
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCfDT2nhPFvSoDEj6nOCr/kQKxnvCjUTzIh66JqTSoySMqVgJH44M0zEgtj/zM3f5rBBVtLq9vYNUbFnWA7sxrXasmzbYGSCZ1jG8Hm5BABN/Be6HSqganNlPHsVlQlVrpi7H2z8Tw7U5NYV/a4vF9FwToKGBTrhZFFmpGhp773pRDhwP2agzDXGoMrhHAjoTeGBcR1ao7gt5zUtiHxMBKwtV2RcLq0jOR8brWVQGAUweuhPOSzrAf1pvDYiIvvVZyF2Wv4QIKE4YpuGjhzTJlNaXMBeCtyPgNa/rxF2kZRmH5lLAlUmMt71I/n5dLbs60xJLSdWF7ec2I695e4sQi2ONkdJ1nhjNKZfK8tVJ4CoQIkThd8uJiqO+GLcjJscUt8v0JjzNxoMUPCOaOycsV0crEuq4mCXHbKrkGrPGFquaAM4/1b9goV7vOT6GdO2jUcIGUz6fGFIum3zMQ80IvdJUfQ1xc5UB4soIKkSTmhpTr3l2glhpt7+Nq3oGiKHrd/OKedy0SZf+YrcyW6zuMhm0duFA6mMVppjfae0CmWb+9i9U/ZVe1ytImXngtZT1PeOCmsUHihUTMOTNWE2cPKoWz+ssLeQWoGhCQYeHy6d8RmTLhbLhWfMzUvrGsaUorLgILjrp6+eIIovrUe3QcrKevhqH4q/Atec2AXCNpwvw== dsc-2@localhost" >> ~/.ssh/authorized_keys

# Шаг 4: Проверить результат
echo "✅ SSH ключи добавлены!"
echo "Проверка:"
ls -la ~/.ssh/
echo ""
echo "Содержимое authorized_keys:"
cat ~/.ssh/authorized_keys
