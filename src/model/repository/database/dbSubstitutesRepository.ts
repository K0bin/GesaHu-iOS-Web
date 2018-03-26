import SubstitutesRepository from '../substitutesRepository'
import Substitute from '../../substitute'
import Announcement from '../../announcement'
import SubstitutesList from '../api/substitutesList'
import { toSubstitute, default as DataSubstitute } from '../database/dbSubstitute'

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
            autoIncrement: true
        });
        objectStore.createIndex("date", "date", { unique: false });
    }

    loadSubstitutesList(date: Date): Promise<SubstitutesList> {
        const repo = this
        return new Promise<SubstitutesList>(function (resolve, reject) {
            if (!repo.db) {
                return reject(new Error("no db"));
            }
            const transaction = repo.db.transaction([substitutesStoreName], "readonly")
            const list = new Array<Substitute>()
            let announcement = ""
            transaction.oncomplete = (e) => {
                resolve({
                    date: date,
                    substitutes: list,
                    announcement: new Announcement(date, announcement)
                })
            }
            transaction.onabort = (e) => { reject() }
            transaction.onerror = (e) => {
                console.error(e)
                reject(e)
            }
            const substitutesStore = transaction.objectStore(substitutesStoreName)
            const index = substitutesStore.index("date")
            const request = index.openCursor(IDBKeyRange.only(date))
            request.onsuccess = function(e: any) {
                let cursor = e.target.result
                if (cursor) {
                    list.push(toSubstitute(cursor.value))
                    cursor.continue();
                }
            }
        })
    }

    insert(value: DataSubstitute[] | Announcement): void {
        if (!this.db) return;

        if (this.isSubstitutes(value)) {
            const transaction = this.db.transaction([substitutesStoreName], "readwrite")
            const substitutesStore = transaction.objectStore(substitutesStoreName)
            for (let substitute of value) {
                const request = substitutesStore.put(substitute, substitute.id ? substitute.id : undefined)
                request.onerror = (error) => {
                    console.log(error);
                }
            }
        } else if (this.isAnnouncement(value)) {

        }
    }

    clear(date: Date) {
        if (!this.db) return;

        const transaction = this.db.transaction([substitutesStoreName], "readwrite")
        const substitutesStore = transaction.objectStore(substitutesStoreName)
        const index = substitutesStore.index('date')
        const destroyCursor = index.openKeyCursor(IDBKeyRange.only(date))
        destroyCursor.onsuccess = (e: any) => {
            const cursor = e.target.result
            if (cursor) {
                substitutesStore.delete(cursor.primaryKey);
                cursor.continue();
            }
        }
    }

    private isSubstitutes(value: DataSubstitute[] | Announcement): value is DataSubstitute[] {
        return Array.isArray(value)
    }
    private isAnnouncement(value: Substitute[] | Announcement): value is Announcement {
        return value instanceof Announcement
    }
}