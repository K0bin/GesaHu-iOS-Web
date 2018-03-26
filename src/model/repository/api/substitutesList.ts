import Substitute from '../../substitute'
import Announcement from '../../announcement'

export default interface SubstitutesList {
    readonly date: Date,
    readonly announcement: Announcement,
    readonly substitutes: Substitute[]
}