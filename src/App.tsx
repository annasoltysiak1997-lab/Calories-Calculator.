import { useState } from 'react';
import { useRoute } from './app/router';
import { BitewiseLaunch } from './components/brand/BitewiseLaunch';
import { EmptyState, Toast } from './components/feedback/Feedback';
import { Screen } from './components/layout/Screen';
import { TokenPreview } from './features/design-system/TokenPreview';
import { DishScreen } from './features/dish/DishScreen';
import { OriginalScreen } from './features/dish/OriginalScreen';
import { FoodScreen } from './features/food/FoodScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { PortionScreen } from './features/portion/PortionScreen';
import { RecipeDetailScreen } from './features/recipes/RecipeDetailScreen';
import { RecipesScreen } from './features/recipes/RecipesScreen';

export default function App() {
  const route = useRoute();
  // The launch splash plays once per page load, over whichever screen the URL opens.
  const [launching, setLaunching] = useState(true);
  let screen;
  switch (route.name) {
    case 'home': screen = <HomeScreen />; break;
    case 'food': screen = <FoodScreen key={`${route.query}-${route.foodId}`} route={route} />; break;
    case 'dish': screen = <DishScreen />; break;
    case 'dish-original': screen = <OriginalScreen />; break;
    case 'portion': screen = <PortionScreen />; break;
    case 'recipes': screen = <RecipesScreen />; break;
    case 'recipe': screen = <RecipeDetailScreen key={route.id} id={route.id} />; break;
    case 'design-system': screen = <TokenPreview />; break;
    default:
      screen = (
        <Screen>
          <EmptyState title="Page not found" actions={<a className="dl-button dl-button--primary" href="#/">Go to Home</a>}>
            This link doesn’t match a screen in the app.
          </EmptyState>
        </Screen>
      );
  }
  return (
    <>
      {screen}
      <Toast />
      {launching ? <BitewiseLaunch onDone={() => setLaunching(false)} /> : null}
    </>
  );
}
