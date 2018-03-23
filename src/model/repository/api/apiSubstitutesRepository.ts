import SubstitutesRepository from '../substitutesRepository'
import Substitute from '../../substitute'
import { deserialize } from './substitutesListDeserializer'

const windows1252 = '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~�€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';
class ApiSubstitutesRepository implements SubstitutesRepository {
    constructor() {}

    //private readonly corsProxy = 'http://allow-any-origin.appspot.com/';
    private readonly corsProxy = 'https://crossorigin.me/';
    //private readonly corsProxy = 'https://cors-anywhere.herokuapp.com/'

    load(date: Date, callback: (date: Date, substitutes: Substitute[]) => void): void {
        const apiUrl = 'https://www.gesahui.de/home/mobil/appscripts/getvplan.php?day=' + date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString();
        const urlString = this.corsProxy+apiUrl; //CORS proxy
        console.log(urlString);

        fetch(urlString, {
            headers: {
                'Origin': 'GesaHu App'
            }
        })
        .then(response => response.arrayBuffer())
        .then(buffer => this.fromWindows1252Buffer(buffer))
        .then(text => JSON.parse(text))
        .then(json => deserialize(json))
        .then(data => callback(data[0], data[2]))
        .catch(error => console.error(error));
    }

    private fromWindows1252Buffer(buffer: ArrayBuffer): string {
        const array = new Uint8Array(buffer);
        let text = '';
        for (let i = 0; i < array.length; i++) {
            text += windows1252.charAt(array[i]);
        }
        return text;
    }
}

export default ApiSubstitutesRepository;