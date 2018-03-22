import SubstitutesRepository from '../substitutesRepository'
import Substitute from '../../substitute'
import { deserialize } from './substitutesListDeserializer'

class ApiSubstitutesRepository implements SubstitutesRepository {
    constructor() {}

    load(date: Date, callback: (date: Date, substitutes: Substitute[]) => void): void {
        let urlString = 'https://www.gesahui.de/home/mobil/appscripts/getvplan.php?day=' + date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
        console.log(urlString);

        fetch(urlString)
            .then(response => response.json())
            .then(json => deserialize(json))
            .then(data => callback(data[0], data[2]))
            .catch(error => console.error("BLA:"+error));
    }
}

export default ApiSubstitutesRepository;