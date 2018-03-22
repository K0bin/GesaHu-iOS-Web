import SubstitutesRepository from '../substitutesRepository'
import Substitute from '../../substitute'
import { deserialize } from './substitutesListDeserializer'

class ApiSubstitutesRepository implements SubstitutesRepository {
    constructor() {}

    load(date: Date, callback: (date: Date, substitutes: Substitute[]) => void): void {
        let apiUrl = 'https://www.gesahui.de/home/mobil/appscripts/getvplan.php?day=' + date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
        let urlString = 'https://crossorigin.me/'+apiUrl; //CORS proxy
        console.log(urlString);

        fetch(urlString, {
            headers: {
                Origin: 'GesaHu App'
            }
        })
        .then(response => response.json())
        .then(json => deserialize(json))
        .then(data => callback(data[0], data[2]))
        .catch(error => console.error(error));
    }
}

export default ApiSubstitutesRepository;