import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fuser) => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
      console.log(fuser?.refreshToken);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    //console.log({nombre, correo, password});

    //esta funcion crea un nuevo usuario con email y password
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, email);
        //Si una acción contiene una promesa dentro de otra promesa, lo mejor es retornar la promesa de adentro
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
        //Firebase no acepta instancias de clases, se deben desestructurar a objetos
      });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}