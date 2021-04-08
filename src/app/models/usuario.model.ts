import { environment } from "src/environments/environment";

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: string,
        public role?: string,
        public uid?: string,
    ) { }

    get imagenUrl() {
        // /upload/usuarios/no-image
        //console.log(this.img);

        // Verificar la existencia de la imagen
        if (!this.img) {
            return `${base_url}/upload/usuarios/no-image`;
        } else if (this.img.includes('https')) {
            return this.img;
        } else if (this.img) {
            return `${base_url}/upload/usuarios/${this.img}`;
        } else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }

}