import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { listComments, createComment, updateComment, deleteComment } from '../API/commentApi.js';
import Alert from './Alert.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

function CommentsDialog({ report, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    useEffect(() => {
        if (report) {
            loadComments();
        }
    }, [report]);

    const loadComments = async () => {
        try {
            const data = await listComments(report.id);
            setComments(data);
        } catch (err) {
            setError('Impossible de charger les commentaires');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newComment) return;
        setError('');
        try {
            await createComment({ report_id: report.id, content: newComment });
            setNewComment('');
            loadComments();
        } catch (err) {
            setError("Erreur lors de l'ajout du commentaire");
        }
    };

    const handleDeleteConfirmed = async () => {
        setError('');
        try {
            await deleteComment(commentToDelete);
            setCommentToDelete(null);
            loadComments();
        } catch (err) {
            setCommentToDelete(null);
            setError('Impossible de supprimer (admin ou auteur uniquement)');
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await updateComment(editingCommentId, editingContent);
            cancelEditing();
            loadComments();
        } catch (err) {
            setError('Impossible de modifier (admin ou auteur uniquement)');
        }
    };

    if (!report) return null;

    return (
        <>
            <div className="modal-backdrop">
                <div className="modal comment-dialog">
                    <div className="comment-dialog-header">
                        <h3>Commentaires : {report.title}</h3>
                        <button onClick={onClose}>Fermer</button>
                    </div>

                    <Alert type="error" message={error} />

                    <div className="comment-list">
                        {comments.length === 0 && <p>Aucun commentaire.</p>}
                        {comments.map(comment => (
                            <div key={comment.id} className="comment-item">
                                {editingCommentId === comment.id ? (
                                    <form onSubmit={handleEditSubmit} className="comment-edit-form">
                                        <input
                                            value={editingContent}
                                            onChange={e => setEditingContent(e.target.value)}
                                        />
                                        <button type="submit">Enregistrer</button>
                                        <button type="button" onClick={cancelEditing}>Annuler</button>
                                    </form>
                                ) : (
                                    <>
                                        <strong>{comment.user_name} :</strong> {comment.content}
                                        <div className="comment-actions">
                                            <button onClick={() => startEditing(comment)}>Modifier</button>
                                            <button onClick={() => setCommentToDelete(comment.id)}>Supprimer</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAdd} className="comment-form">
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Écrire un commentaire..."
                        />
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                open={commentToDelete !== null}
                title="Supprimer le commentaire"
                message="Voulez-vous vraiment supprimer ce commentaire ?"
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setCommentToDelete(null)}
            />
        </>
    );
}

CommentsDialog.propTypes = {
    report: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
    }),
    onClose: PropTypes.func.isRequired,
};

export default CommentsDialog;
