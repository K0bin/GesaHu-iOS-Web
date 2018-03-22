import Substitute from '../substitute'

interface SubstitutesRepository {
    load(date: Date, callback: (date: Date, substitutes: Substitute[]) => void): void;
}

export default SubstitutesRepository;