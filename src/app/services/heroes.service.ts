import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HeroesService {

	private url = 'https://loginapp-d9adf.firebaseio.com';

	constructor( private http: HttpClient ) { 

	}

	crearHeroe( heroe: HeroeModel ) {
		return this.http.post( `${ this.url }/heroes.json`, heroe )
						.pipe(
							map( ( res: any ) => {
								heroe.id = res.name;
								return heroe;
							})
						)
	}

	actualizarHeroe( heroe: HeroeModel ) {

		//Para eliminar el campo id, sin cortar la referencia que será enviada a la API de Firebase
		const heroeTemporal = {
			... heroe
		};

		delete heroeTemporal.id;

		return this.http.put( `${ this.url }/heroes/${ heroe.id }.json`, heroeTemporal );

	}

	borrarHeroe( id: string ) {
		return this.http.delete( `${ this.url }/heroes/${ id }.json` );
	}

	getHeroe( id: string ) {
		return this.http.get( `${ this.url }/heroes/${ id }.json` );
	}

	getHeroes() {
		return this.http.get( `${ this.url }/heroes.json` )
						.pipe(
							map( res => this.crearArregloHeroes( res )),
							delay( 500 )
						);
	}

	private crearArregloHeroes( heroesObj: object ) {

		const heroes: HeroeModel[] = [];

		if( heroesObj === null ) {
			return [];
		}

		Object.keys( heroesObj ).forEach( key => {

			const heroe: HeroeModel = heroesObj[ key ];
			heroe.id = key;

			heroes.push( heroe );

		});

		return heroes;

	}

}
