import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
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

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
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
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [newRecipeName, setNewRecipeName] = useState("");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Спагетти Карбонара",
          ingredients: [
            { name: "Спагетти", amount: 400, unit: "г" },
            { name: "Бекон", amount: 200, unit: "г" },
            { name: "Яйца", amount: 4, unit: "шт" },
            { name: "Пармезан", amount: 100, unit: "г" },
          ],
          instructions: "1. Отварить спагетти. 2. Обжарить бекон. 3. Смешать яйца и сыр. 4. Соединить все ингредиенты.",
          servings: 4,
        },
        {
          id: 2,
          name: "Греческий салат",
          ingredients: [
            { name: "Помидоры", amount: 400, unit: "г" },
            { name: "Огурцы", amount: 200, unit: "г" },
            { name: "Красный лук", amount: 100, unit: "г" },
            { name: "Фета", amount: 200, unit: "г" },
            { name: "Оливки", amount: 100, unit: "г" },
          ],
          instructions: "1. Нарезать овощи. 2. Добавить фету и оливки. 3. Заправить оливковым маслом и лимонным соком.",
          servings: 4,
        },
        {
          id: 3,
          name: "Борщ",
          ingredients: [
            { name: "Говядина", amount: 500, unit: "г" },
            { name: "Свекла", amount: 300, unit: "г" },
            { name: "Капуста", amount: 200, unit: "г" },
            { name: "Картофель", amount: 300, unit: "г" },
            { name: "Морковь", amount: 100, unit: "г" },
          ],
          instructions: "1. Сварить бульон. 2. Добавить овощи. 3. Варить до готовности. 4. Подавать со сметаной.",
          servings: 6,
        },
        {
          id: 4,
          name: "Суши роллы",
          ingredients: [
            { name: "Рис", amount: 300, unit: "г" },
            { name: "Нори", amount: 4, unit: "листа" },
            { name: "Лосось", amount: 200, unit: "г" },
            { name: "Огурец", amount: 100, unit: "г" },
            { name: "Авокадо", amount: 1, unit: "шт" },
          ],
          instructions: "1. Приготовить рис. 2. Нарезать ингредиенты. 3. Сформировать роллы. 4. Нарезать и подавать с соевым соусом.",
          servings: 2,
        },
        {
          id: 5,
          name: "Тирамису",
          ingredients: [
            { name: "Маскарпоне", amount: 500, unit: "г" },
            { name: "Яйца", amount: 4, unit: "шт" },
            { name: "Савоярди", amount: 200, unit: "г" },
            { name: "Кофе", amount: 200, unit: "мл" },
            { name: "Какао", amount: 50, unit: "г" },
          ],
          instructions: "1. Взбить яйца с сахаром. 2. Добавить маскарпоне. 3. Пропитать савоярди кофе. 4. Выложить слоями. 5. Посыпать какао.",
          servings: 8,
        },
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    if (newRecipeName.trim() !== "") {
      const newRecipe: Recipe = {
        id: Date.now(),
        name: newRecipeName.trim(),
        ingredients: [],
        instructions: "",
        servings: 1,
      };
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName("");
    }
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
    setServingsMultiplier(1);
  };

  const handleUpdateRecipe = () => {
    if (editingRecipe) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === editingRecipe.id ? editingRecipe : recipe
        )
      );
    }
    setIsDialogOpen(false);
    setEditingRecipe(null);
  };

  const handleServingsChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number' && editingRecipe) {
      const multiplier = newValue / editingRecipe.servings;
      setServingsMultiplier(multiplier);
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
