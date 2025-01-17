import cuid from 'cuid';
import db from 'db';
import { mail } from 'mail';

import { resolver } from '@blitzjs/rpc';

import { LoginWithCallbackInput, LoginWithCallbackInputType } from 'app/components/forms/validations';
import { isListeux } from 'app/core/utils/listeux_or_troll';

export default resolver.pipe(
  resolver.zod(LoginWithCallbackInput),
  async ({ identifier, callbackUrl }: LoginWithCallbackInputType) => {
    const card = parseInt(identifier);
    const key = Number.isNaN(card) ? 'email' : 'card';
    const value = key === 'card' ? card : identifier;

    const user = await db.user.findUnique({ where: { [key]: value } });

    const expiresDate = user
      ? isListeux(user)
        ? new Date(new Date().getTime() + 60 * 1000)
        : new Date(new Date().getTime() + 15 * 60 * 1000)
      : new Date(new Date().getTime() + 15 * 60 * 1000);

    if (user) {
      const token = cuid();
      const subject = `Connexion à ${process.env.NEXT_PUBLIC_FRONTEND_URL}`;

      if (process.env.NODE_ENV === 'development') {
        console.log(`Lien de connexion: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/authenticate?token=${token}`);
      }

      try {
        await Promise.all([
          db.loginRequest.create({
            data: { userId: user.id, token, callbackUrl, expires: expiresDate }
          }),
          mail.send({
            subject,
            to: user.email,
            view: 'login',
            variables: {
              subject,
              firstname: user.firstname,
              link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/authenticate?token=${token}`
            }
          })
        ]);
      } catch (err) {
        console.log(err);
        return err.message;
      }
    }

    return 'Vérifiez votre boîte mail. Un lien de connexion vous a été envoyé.';
  }
);
