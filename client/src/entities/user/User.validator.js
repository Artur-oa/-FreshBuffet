export class UserValidator {
  static validateMail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(passwordHash) {
    const hasUpperCase = /[A-Z]/; // Проверка на наличие заглавной буквы
    const hasLowerCase = /[a-z]/; // Проверка на наличие строчной буквы
    const hasNumbers = /\d/; // Проверка на наличие цифры
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/; // Проверка на наличие спецсимвола
    const isValidLength = passwordHash.length >= 8; // Проверка на минимальную длину

    if (
      !hasUpperCase.test(passwordHash) ||
      !hasLowerCase.test(passwordHash) ||
      !hasNumbers.test(passwordHash) ||
      !hasSpecialCharacters.test(passwordHash) ||
      !isValidLength
    ) {
      return false;
    } else {
      return true;
    }
  }

  static validate({ name, email, passwordHash }) {
    if (
      !name ||
      !email ||
      !passwordHash ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof passwordHash !== 'string' ||
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      passwordHash.trim().length === 0
    ) {
      return { isValid: false, error: 'Создание пользователя с такими полями не доступно' };
    }

    if (!this.validateMail(email)) {
      return { isValid: false, error: 'Неподдерживаемый формат почты' };
    }
    if (!this.validatePassword(passwordHash)) {
      return {
        isValid: false,
        error:
          'Неподдерживаемый формат пароля. Должен быть сиввол, большая буква, маленькая, цифра и не менее 8 символов.',
      };
    }

    return { isValid: true, error: null };
  }

  static validateLogin({ email, passwordHash }) {
    if (
      !email ||
      !passwordHash ||
      typeof email !== 'string' ||
      typeof passwordHash !== 'string' ||
      email.trim().length === 0 ||
      passwordHash.trim().length === 0
    ) {
      return { isValid: false, error: 'Создание пользователя с такими полями не доступно' };
    }

    if (!this.validateMail(email)) {
      return { isValid: false, error: 'Неподдерживаемый формат почты' };
    }
    if (!this.validatePassword(passwordHash)) {
      return {
        isValid: false,
        error:
          'Неподдерживаемый формат пароля. Должен быть сиввол, большая буква, маленькая, цифра и не менее 8 символов.',
      };
    }

    return { isValid: true, error: null };
  }
  // ! qQ1*qqqqqqqq
}
