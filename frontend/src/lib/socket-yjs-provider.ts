import * as Y from 'yjs';
import { Socket } from 'socket.io-client';
import { Awareness } from 'y-protocols/awareness';
import { Observable } from 'lib0/observable';

export class SocketIOProvider extends Observable<string> {
  public awareness: Awareness;
  
  constructor(
    private socket: Socket,
    private documentId: string,
    private doc: Y.Doc,
    { awareness = new Awareness(doc) } = {}
  ) {
    super();
    this.awareness = awareness;

    // Listen to local Yjs updates and send them to the server
    this.doc.on('update', this.onUpdate);
    this.awareness.on('update', this.onAwarenessUpdate);

    // Listen to remote updates from the server
    this.socket.on('sync-update', this.onRemoteUpdate);
    this.socket.on('awareness-update', this.onRemoteAwarenessUpdate);

  }

  connect() {
    this.socket.emit('join-document', this.documentId);
    this.emit('status', [{ status: 'connected' }]);
    this.emit('sync', [true]);
  }

  private onUpdate = (update: Uint8Array, origin: any) => {
    if (origin !== this) {
      this.socket.emit('sync-update', {
        documentId: this.documentId,
        update: Array.from(update),
      });
    }
  };

  private onRemoteUpdate = (updateBuffer: number[]) => {
    const update = new Uint8Array(updateBuffer);
    Y.applyUpdate(this.doc, update, this);
  };

  private onAwarenessUpdate = ({ added, updated, removed }: any, origin: any) => {
    if (origin !== this) {
      const changedClients = added.concat(updated).concat(removed);
      const update = import('y-protocols/awareness').then(m => {
        const encoded = m.encodeAwarenessUpdate(this.awareness, changedClients);
        this.socket.emit('awareness-update', {
          documentId: this.documentId,
          update: Array.from(encoded),
        });
      });
    }
  };

  private onRemoteAwarenessUpdate = (updateBuffer: number[]) => {
    const update = new Uint8Array(updateBuffer);
    import('y-protocols/awareness').then(m => {
      m.applyAwarenessUpdate(this.awareness, update, this);
    });
  };

  disconnect() {
    this.doc.off('update', this.onUpdate);
    this.awareness.off('update', this.onAwarenessUpdate);
    this.socket.off('sync-update', this.onRemoteUpdate);
    this.socket.off('awareness-update', this.onRemoteAwarenessUpdate);
    this.socket.emit('leave-document', this.documentId);
  }
}
