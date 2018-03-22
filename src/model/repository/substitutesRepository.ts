import Substitute from '../substitute'

interface SubstitutesRepository {
    load(date: Date, callback: (substitutes: Array<Substitute>) => void): void;
}

export default SubstitutesRepository;