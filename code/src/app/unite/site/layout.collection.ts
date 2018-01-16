import { GridLayout } from "./layouts/gridLayout/grid.layout";
import { CarouselLayout  } from "./layouts/carouselLayout/carousel.layout";
import { ListLayout } from "./layouts/listLayout/list.layout";
import { IconListLayout } from "./layouts/iconlistLayout/iconlist.layout";
import { ProgressbarLayout } from "./layouts/progressbarLayout/progressbar.layout";
import { PersonalLayout } from "./layouts/personalLayout/personal.layout";

export const FactoryLayouts = {
    'grid' : GridLayout,
    'list' : ListLayout,
    'carousel': CarouselLayout,
    'progressbar': ProgressbarLayout,
    'personal':PersonalLayout,
    'iconlist':IconListLayout
}
export const Layouts = [GridLayout,ListLayout,CarouselLayout,ProgressbarLayout,PersonalLayout,IconListLayout];