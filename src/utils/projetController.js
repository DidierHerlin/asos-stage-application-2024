// projetController.js
import { fetchProjets, deleteProjet, updateProjet } from './projetModel';

export const getProjets = async (setProjets, setLoading) => {
  try {
    const data = await fetchProjets();
    setProjets(data);
  } catch (error) {
    console.error('Error fetching projets:', error);
  } finally {
    setLoading(false);
  }
};

export const handleDeleteProjet = async (id, projets, setProjets) => {
  await deleteProjet(id);
  setProjets(projets.filter((projet) => projet.id !== id));
};

export const handleEditProjet = async (id, projetData, setProjets) => {
  await updateProjet(id, projetData);
  setProjets((prev) => prev.map((projet) => (projet.id === id ? projetData : projet)));
};
