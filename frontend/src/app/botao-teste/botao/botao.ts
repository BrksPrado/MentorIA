import { Component } from '@angular/core';

@Component({
  selector: 'app-botao',
  standalone: false,
  templateUrl: './botao.html',
  styleUrl: './botao.css'
})
export class Botao {
  onClick(action: string) {
    console.log(`Botão ${action} clicado!`);
    alert(`Ação: ${action}`);
  }
}