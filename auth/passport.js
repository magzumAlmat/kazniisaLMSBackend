const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('./models/User');

// Настройки для JWT
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
  secretOrKey: 'секретный_ключ', // Секретный ключ для подписи токена
};

// Стратегия для проверки JWT
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id); // Поиск пользователя по ID из токена
      if (user) {
        return done(null, user); // Пользователь найден
      } else {
        return done(null, false, { message: 'Пользователь не найден' }); // Пользователь не найден
      }
    } catch (error) {
      return done(error, false, { message: 'Ошибка при поиске пользователя' }); // Ошибка при поиске пользователя
    }
  })
);

// Локальная стратегия для аутентификации по email и паролю
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Поле для email
      passwordField: 'password', // Поле для пароля
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } }); // Поиск пользователя по email

        if (!user) {
          return done(null, false, { message: 'Пользователь не найден' }); // Пользователь не найден
        }

        const isValidPassword = await bcrypt.compare(password, user.password); // Проверка пароля

        if (!isValidPassword) {
          return done(null, false, { message: 'Неверный пароль' }); // Пароль неверный
        }

        return done(null, user); // Успешная аутентификация
      } catch (error) {
        return done(error, false); // Ошибка при аутентификации
      }
    }
  )
);

module.exports = {
  jwtOptions,
  passport,
};