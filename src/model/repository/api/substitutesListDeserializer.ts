import Substitute from "../../substitute"

export function deserialize(json: any): [Date, String, Substitute[], any[]] {
    let announcement = json["Hinweise"] as string;

    let datumStr = json["Datum"] as string
    let date = new Date(datumStr);

    let stunden = json["Stunden"] as Array<any>;
    let substitutes = new Array<Substitute>();
    for (let stunde of stunden) {
        substitutes.push(deserializeSubstitute(date, stunde))
    }

    let aufsichten = json['Aufsichten'] as Array<any>;

    return [date, announcement, substitutes, aufsichten];
}

function deserializeSubstitute(date: Date, jsonObject: any): Substitute {
    let subjectAbbr = parseHtml((jsonObject["Fach"] as string).trim());
        if (subjectAbbr == "---") {
            subjectAbbr = "";
        }
    //let subject = resolver.resolveSubject(subjectAbbr);
    let subject = subjectAbbr;
    var _class = parseHtml((jsonObject["Klasse"] as string).trim())
    if (_class == "---") {
        _class = "";
    }
    var teacherAbbr = parseHtml((jsonObject["Lehrer"] as string).trim());
    if (teacherAbbr == "---") {
        teacherAbbr = "";
    }
    //let teacher = resolver.resolveTeacher(teacherAbbr);
    let teacher = teacherAbbr;
    var substituteAbbr = parseHtml((jsonObject["Vertretungslehrer"] as string).trim());
    if (substituteAbbr == "---") {
        substituteAbbr = "";
    }
    //let substitute = resolver.resolveTeacher(substituteAbbr);
    let substitute = substituteAbbr;
    let hint = parseHtml((jsonObject["Hinweis"] as string).trim());
    var room = parseHtml((jsonObject["Raum"] as string).trim());
    if (room == "---") {
        room = "";
    }
    let isRelevant = (jsonObject["relevant"] as string).toLowerCase() == "true";

    //Bindestrich workaround
    let beginStr = (jsonObject["Stundeanfang"] as string).replace("-","").trim();
    let begin = parseInt(beginStr);
    let endStr = (jsonObject["Stundeende"] as string).replace("-","").trim();
    let end = parseInt(endStr);

    return new Substitute(date, begin, (end - begin) + 1, subject, _class, teacher, substitute, room, hint, isRelevant);
}

let domParser = new DOMParser();
function parseHtml(text: string): string {
    let dom = domParser.parseFromString('<!doctype html><body>'+text, 'text/html');
    return dom.body.textContent ? dom.body.textContent : '';
}