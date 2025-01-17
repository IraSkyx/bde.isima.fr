import { faker } from '@faker-js/faker';

const users = async (db) => {
  const promotion = await db.promotion.findFirst();

  //User to log in with
  await db.user.create({
    data: {
      id: '123456789',
      lastname: 'Lenoir',
      firstname: 'Adrien',
      nickname: faker.name.fullName(),
      image: faker.image.imageUrl(100, 100, undefined, true),
      email: 'adrien.lenoir42440@gmail.com',
      card: 941,
      balance: 0,
      roles: '*',
      promotionId: promotion.id
    }
  });

  await db.user.create({
    data: {
      id: '9887654321',
      lastname: 'Duet',
      firstname: 'Venceslas',
      nickname: 'venny',
      image: 'https://i.imgur.com/VbdBkxz.png',
      email: 'contact@citorva.fr',
      card: 1463,
      balance: 0,
      roles: '*',
      promotionId: promotion.id
    }
  });

  await db.user.create({
    data: {
      id: '696969696969',
      lastname: 'Galpin',
      firstname: 'Thomas',
      nickname: 'Topin',
      image: faker.image.imageUrl(100, 100, undefined, true),
      email: faker.internet.email(),
      card: -4269,
      balance: 51654,
      roles: '*',
      promotionId: promotion.id
    }
  });

  for (let i = 0; i < 4; ++i) {
    await db.user.create({
      data: {
        lastname: faker.name.lastName(),
        firstname: faker.name.firstName(),
        nickname: faker.name.fullName(),
        image: faker.image.imageUrl(100, 100, undefined, true),
        email: faker.internet.email(),
        card: faker.datatype.number(),
        balance: parseFloat(faker.finance.amount()),
        promotionId: promotion.id
      }
    });
  }
};

export default users;
