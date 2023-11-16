import { InMemoryDbService, RequestInfo } from "angular-in-memory-web-api"
import { Category } from './pages/categories/shared/category.model';


export class InMemoryDatabase implements InMemoryDbService {
  
   createDb() {
    const categories: Category[] = [
      {id: 1, name: "Lazer", description: "Pagamentos de Contas da casa"},
      {id: 2, name: "Saude", description: "Plano de saude"},
      {id: 3, name: "Salario", description: "Salario recebido"},
      {id: 4, name: "Moradia", description: "Pagamento da moradia"},
      {id: 5, name: "Freelas", description: "Trabalhos como freelancer"},
    ];

    return { categories }
  }

}