interface ObjectPagination{
  currentPage:number,
  limitItems:number,
  pageStart?:number,
  pageEnd?:number,
  skip?:number,
  totalPage?:number
}
const paginationHelper = (objectPagination:ObjectPagination,query:Record<string,any>,countTasks:number):ObjectPagination => {
  if(isNaN(query.page) === false){
    objectPagination.currentPage=parseInt(query.page);
  }
  if(isNaN(query.limit) === false){
    objectPagination.limitItems=parseInt(query.limit);
  }
  objectPagination.skip=(objectPagination.currentPage-1)*objectPagination.limitItems;

  const totalPage=Math.ceil(countTasks/objectPagination.limitItems);
  objectPagination.totalPage=totalPage;

  if(objectPagination.currentPage > 1 && (objectPagination.currentPage <= objectPagination.totalPage-2)){
    objectPagination.pageStart=objectPagination.currentPage-1;
    objectPagination.pageEnd=objectPagination.currentPage+1;
  } 
  else if(objectPagination.currentPage === 1){
    objectPagination.pageStart=1;
    objectPagination.pageEnd=3;
  }
  else if(objectPagination.currentPage > objectPagination.totalPage-2){
    objectPagination.pageStart=objectPagination.totalPage-2;
    objectPagination.pageEnd=objectPagination.totalPage;
  }

  return objectPagination;
}

export default paginationHelper;