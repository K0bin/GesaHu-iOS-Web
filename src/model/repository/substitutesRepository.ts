import Substitute from '../substitute'
import Announcement from '../announcement'
import DbSubstitute from './database/dbSubstitute'
import SubstitutesList from './api/substitutesList'

export default interface SubstitutesRepository {
    connect(): Promise<void>
    loadSubstitutesList(date: Date): Promise<SubstitutesList>;
    insert(value: DbSubstitute[] | Announcement): void
    clear(date: Date): void
}
