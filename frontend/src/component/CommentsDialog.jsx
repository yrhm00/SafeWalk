import { useState, useEffect } from 'react';
import { listComments, createComment, updateComment, deleteComment } from '../API/commentApi.js';

function CommentsDialog({ report, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (report) {
            loadComments();
        }
    }, [report]);

    const loadComments = async () => {
        const data = await listComments(report.id);
        setComments(data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newComment) return;
        try {
            await createComment({ report_id: report.id, content: newComment });
            setNewComment('');
            loadComments();
        } catch (e) {
            alert("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
            try {
                await deleteComment(id);
                loadComments();
            } catch (e) {
                alert("Impossible de supprimer (admis ou auteur uniquement)");
            }
        }
    };

    const handleEdit = async (comment) => {
        const newContent = window.prompt("Modifier votre commentaire :", comment.content);
        if (newContent && newContent !== comment.content) {
            try {
                await updateComment(comment.id, newContent);
                loadComments();
            } catch (e) {
                alert("Impossible de modifier (admis ou auteur uniquement)");
            }
        }
    };

    if (!report) return null;

    return (
        <div className="modal-overlay" style={styles.overlay}>
            <div className="modal-content" style={styles.modal}>
                <div style={styles.header}>
                    <h3>Commentaires: {report.title}</h3>
                    <button onClick={onClose}>Fermer</button>
                </div>

                <div style={styles.list}>
                    {comments.length === 0 && <p>Aucun commentaire.</p>}
                    {comments.map(c => (
                        <div key={c.id} style={styles.item}>
                            <strong>{c.user_name} :</strong> {c.content}
                            <div style={styles.actions}>
                                <button onClick={() => handleEdit(c)}>Modifier</button>
                                <button onClick={() => handleDelete(c.id)}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAdd} style={styles.form}>
                    <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Écrire un commentaire..."
                        style={styles.input}
                    />
                    <button type="submit">Envoyer</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'
    },
    list: {
        flex: 1, overflowY: 'auto', marginBottom: '15px', border: '1px solid #ddd', padding: '10px'
    },
    item: {
        marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee'
    },
    actions: {
        marginTop: '5px', fontSize: '0.8em'
    },
    form: {
        display: 'flex', gap: '10px'
    },
    input: {
        flex: 1, padding: '5px'
    }
};

export default CommentsDialog;
