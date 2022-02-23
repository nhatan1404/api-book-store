import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateReviewDTO {
  @IsNotEmpty({ message: 'Nội dung đánh giá không được bỏ trống' })
  @IsNotEmpty({ message: 'Nội dung đánh giá không được bỏ trống' })
  comment: string;

  @IsNotEmpty({ message: 'Đánh giá không được bỏ trống' })
  @Min(1, { message: 'Đánh giá phải từ 1 đến 5' })
  @Max(5, { message: 'Đánh giá phải từ 1 đến 5' })
  rate: number;
}
