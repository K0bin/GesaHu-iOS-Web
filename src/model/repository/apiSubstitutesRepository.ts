import SubstitutesRepository from './substitutesRepository'
import Substitute from '../substitute'

class ApiSubstitutesRepository implements SubstitutesRepository {
    constructor() {}

    load(date: Date, callback: (substitutes: Substitute[]) => void): void {
        let urlString = 'https://www.gesahui.de/home/mobil/appscripts/getboards.php?user=STom399&day=' + date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
        console.log(urlString);

        fetch(urlString)
            .then(response => response.json())
            .then(json => console.log("BLA:"+json))
            .catch(error => console.error("BLA:"+error));
    }
}

export default ApiSubstitutesRepository;