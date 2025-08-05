import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();
  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // переносим код, который делали под @todo: #2.6
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу
        case "first":
          page = 1;
          break; // переход на первую страницу
        case "last":
          page = pageCount;
          break; // переход на последнюю страницу
      }

    return Object.assign({}, query, {
      // добавим параметры к query, но не изменяем исходный объект
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // переносим код, который делали под @todo: #2.4
    const visiblePages = getPages(page, pageCount, 5); // Получим массив страниц, которые нужно показать, выводим только 5 страниц
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        // перебираем их и создаём для них кнопку
        const el = pageTemplate.cloneNode(true); // клонируем шаблон, который запомнили ранее
        return createPage(el, pageNumber, pageNumber === page); // вызываем колбэк из настроек, чтобы заполнить кнопку данными
      })
    );
    fromRow.textContent = Math.min((page - 1) * limit + 1, total);
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    updatePagination,
    applyPagination,
  };
};
