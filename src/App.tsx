import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  min-height: 100vh;
  color: #fff;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
    background-color: #45B649;
    &:hover {
      background-color: #39A83C;
    }
  }
`;

const StyledListItem = styled(ListItem)`
  && {
    background-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  }
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 1rem;
    .MuiOutlinedInput-root {
      fieldset {
        border-color: rgba(255, 255, 255, 0.5);
      }
      &:hover fieldset {
        border-color: rgba(255, 255, 255, 0.7);
      }
      &.Mui-focused fieldset {
        border-color: #fff;
      }
    }
    .MuiInputLabel-root, .MuiInputBase-input {
      color: #fff;
    }
  }
`;

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipesCollection = collection(db, "recipes");
      const recipesSnapshot = await getDocs(recipesCollection);
      const recipesList = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Recipe));
      setRecipes(recipesList);
    };

    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    if (newRecipeName.trim() !== "") {
      const newRecipe: Omit<Recipe, "id"> = {
        name: newRecipeName.trim(),
        ingredients: [],
        instructions: "",
        servings: 1,
      };
      const docRef = await addDoc(collection(db, "recipes"), newRecipe);
      setRecipes([...recipes, { id: docRef.id, ...newRecipe }]);
      setNewRecipeName("");
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    await deleteDoc(doc(db, "recipes", id));
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleUpdateRecipe = async () => {
    if (editingRecipe) {
      const { id, ...recipeData } = editingRecipe;
      await updateDoc(doc(db, "recipes", id), recipeData);
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingRecipe.id ? editingRecipe : recipe
        )
      );
    }
    setIsDialogOpen(false);
    setEditingRecipe(null);
  };

  const handleServingsChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number' && editingRecipe) {
      const multiplier = newValue / editingRecipe.servings;
      setEditingRecipe({
        ...editingRecipe,
        ingredients: editingRecipe.ingredients.map(ingredient => ({
          ...ingredient,
          amount: Number((ingredient.amount * multiplier).toFixed(2))
        })),
        servings: newValue
      });
    }
  };

  return (
    <AppContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Книга рецептов
      </Typography>
      <StyledTextField
        fullWidth
        variant="outlined"
        label="Новый рецепт"
        value={newRecipeName}
        onChange={(e) => setNewRecipeName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddRecipe()}
      />
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddRecipe}
        startIcon={<RestaurantIcon />}
      >
        Добавить рецепт
      </StyledButton>
      <List>
        {recipes.map((recipe) => (
          <StyledListItem key={recipe.id}>
            <ListItemText
              primary={recipe.name}
              secondary={`Порций: ${recipe.servings}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditRecipe(recipe)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </StyledListItem>
        ))}
      </List>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingRecipe?.name}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Количество порций</Typography>
          <Slider
            value={editingRecipe?.servings || 1}
            onChange={handleServingsChange}
            aria-labelledby="servings-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={10}
          />
          <Typography variant="h6" gutterBottom>Ингредиенты:</Typography>
          <List>
            {editingRecipe?.ingredients.map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${ingredient.name}: ${ingredient.amount} ${ingredient.unit}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" gutterBottom>Инструкции:</Typography>
          <Typography>{editingRecipe?.instructions}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleUpdateRecipe} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}

export default App;
