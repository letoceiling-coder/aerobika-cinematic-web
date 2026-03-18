# SSH Setup Commands for Server

## Команды для выполнения на сервере (chase.beget.com)

### Шаг 1: Создать директорию .ssh и настроить права

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Шаг 2: Добавить ваш публичный ключ

**Вариант A: Если у вас уже есть публичный ключ (скопируйте его содержимое)**

```bash
# Замените YOUR_PUBLIC_KEY на содержимое вашего ~/.ssh/id_rsa.pub или ~/.ssh/id_ed25519.pub
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
```

**Вариант B: Использовать nano редактор**

```bash
nano ~/.ssh/authorized_keys
# Вставьте ваш публичный ключ (одна строка)
# Сохраните: Ctrl+O, Enter, Ctrl+X
```

**Вариант C: Если ключа нет, сгенерировать на сервере**

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Нажмите Enter для всех вопросов (или укажите путь)
cat ~/.ssh/id_ed25519.pub
# Скопируйте вывод и добавьте в authorized_keys
```

### Шаг 3: Проверить права доступа

```bash
ls -la ~/.ssh/
# Должно быть:
# drwx------ .ssh
# -rw------- authorized_keys
```

### Шаг 4: Проверить подключение (с вашего локального компьютера)

```bash
# С вашего локального компьютера выполните:
ssh murashun@chase.beget.com
# Должно подключиться без пароля
```

---

## Быстрая команда (если ключ уже скопирован)

Если вы уже скопировали содержимое вашего публичного ключа, выполните на сервере:

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo "ВАШ_ПУБЛИЧНЫЙ_КЛЮЧ_ЗДЕСЬ" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo "✅ SSH key added successfully"
```

---

## Проверка на сервере

```bash
# Проверить содержимое authorized_keys
cat ~/.ssh/authorized_keys

# Проверить права
ls -la ~/.ssh/
```

---

## Если нужно скопировать ключ с локального компьютера на сервер

**С вашего локального компьютера (Windows PowerShell):**

```powershell
# Показать ваш публичный ключ
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
# ИЛИ
Get-Content $env:USERPROFILE\.ssh\id_rsa.pub

# Скопируйте вывод и вставьте в команду на сервере
```

---

## Полная настройка одной командой (если ключ готов)

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI..." >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo "✅ Done! Now test: ssh murashun@chase.beget.com"
```

**Замените `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...` на ваш реальный публичный ключ!**
