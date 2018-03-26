import SubstitutesRepository from './substitutesRepository'
import Substitute from '../substitute'
import Announcement from '../announcement'

const substitutesStoreName = "substitutes"

export default class DBSubstitutesRepository implements SubstitutesRepository {
    private db: IDBDatabase | null = null

    connect(): Promise<void> {
        const repo = this
        return new Promise<void>(function(resolve, reject) {
            let open = indexedDB.open('GesaHu', 1)
            open.onupgradeneeded = function(e: any) {
                repo.db = e.target.result
                repo.create()
                resolve()
            }
            open.onsuccess = function(e: any) {
                repo.db = e.target.result
                resolve()
            }
            open.onerror = function(e: any) {
                console.error(e);
                reject()
            }
            open.onblocked = function(e: any) {
                console.error(e)
                reject()
            }
        })
    }

    private create() {
        if (this.db == null) throw new ReferenceError();

        let objectStore = this.db.createObjectStore(substitutesStoreName, {
            keyPath: "id",
            autoIncrement: true
        });
        objectStore.createIndex("date", "date", { unique: false });
    }

    loadSubstitutes(date: Date): Promise<Substitute[]> {
        const repo = this
        return new Promise<Substitute[]>(function (resolve, reject) {
            if (!repo.db) {
                return Promise.reject(new Array<Substitute>());
            }
            let transaction = repo.db.transaction([substitutesStoreName], "readonly")
            let substitutesStore = transaction.objectStore(substitutesStoreName)
            let index = substitutesStore.index("date")
            let request = index.get(date)
            request.onsuccess = function(e: any) {
                console.log(e.result)
            }
            request.onerror = function(e: any) {
                console.error(e)
                reject()
            }
        })
    }

    loadAnnouncement(date: Date): Promise<Announcement> {
        return Promise.resolve(new Announcement(date, ""))
    }

    insert(value: Substitute[] | Announcement): void {
        if (!this.db) return;

        if (this.isSubstitutes(value)) {
            let transaction = this.db.transaction([substitutesStoreName], "readwrite")
            let substitutesStore = transaction.objectStore(substitutesStoreName)
            for (let substitute of value) {
                substitutesStore.add(substitute)
            }
        } else if (this.isAnnouncement(value)) {

        }
    }

    private isSubstitutes(value: Substitute[] | Announcement): value is Substitute[] {
        return Array.isArray(value)
    }
    private isAnnouncement(value: Substitute[] | Announcement): value is Announcement {
        return value instanceof Announcement
    }
}