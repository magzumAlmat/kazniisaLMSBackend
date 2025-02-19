const Course = require('../models/Courses');
const User = require('../auth/models/User');
const Stream = require('../models/Stream');



exports.createStream = async (req, res) => {
  console.log('Creating Stream started');

  try {
    // Находим курс и учителя по ID
    const course = await Course.findByPk(req.body.courseId); // Используем данные из запроса
    const teacher = await User.findByPk(req.body.teacherId); // Используем данные из запроса

    if (!course || !teacher) {
      return res.status(404).json({ error: 'Курс или учитель не найдены' });
    }

    // Создаем новый поток
    const newStream = await Stream.create({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      cost: req.body.cost,
      maxStudents: req.body.maxStudents,
      courseId: course.id,
      teacherId: teacher.id,
    });

    console.log('Новый поток создан:', newStream.toJSON());

    // Отправляем успешный ответ клиенту
    return res.status(201).json({
      message: 'Поток успешно создан',
      stream: newStream,
    });
  } catch (error) {
    console.error('Ошибка при создании потока:', error);
    return res.status(500).json({ error: 'Ошибка сервера при создании потока' });
  }
};


exports.addStudentsToStream = async (req, res) => {
    try {
      const {  studentIds } = req.body;
  
      const {streamId}=req.params
      console.log('streamId= ',streamId,'studentIds= ',studentIds)


      // Находим поток по ID
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }

  
      // Находим студентов по их ID
      const students = await User.findAll({
        where: { id: studentIds, roleId: 3 }, // roleId = 3 для студентов
      });
  
      console.log('students- ',students)
      
      if (!students.length) {
        return res.status(404).json({ error: 'Студенты не найдены' });
      }
  
      // Добавляем студентов в поток
      await stream.addStudents(students);
  
      return res.status(200).json({
        message: 'Студенты успешно добавлены в поток',
        students: students.map((student) => student.toJSON()),
      });
    } catch (error) {
      console.error('Ошибка при добавлении студентов:', error);
      return res.status(500).json({ error: 'Ошибка сервера при добавлении студентов' });
    }
  };