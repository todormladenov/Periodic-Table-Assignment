import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-seach-icon',
  templateUrl: './seach-icon.component.html',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeachIconComponent {

}
