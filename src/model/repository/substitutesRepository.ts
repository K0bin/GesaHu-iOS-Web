import Substitute from '../substitute'
import Announcement from '../announcement'

export default interface SubstitutesRepository {
    connect(): Promise<void>
    loadSubstitutes(date: Date): Promise<Substitute[]>;
    loadAnnouncement(date: Date): Promise<Announcement>;
    insert(value: Substitute[] | Announcement): void
}
