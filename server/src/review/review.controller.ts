import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review, ReviewStatus } from './review.entity';

@Controller('review')
export class ReviewController {
    constructor(private readonly _reviewService: ReviewService<Review>) {}

    @Get()
    findAll(): Promise<{data: Review[], status: number}> {
        return this._reviewService.findAll()
            .then(reviews => {
                return {
                    data: reviews,
                    status: 0
                };
            });
    }

    @Get('/employee/:id')
    findAllReviewOfEmployee(@Param('id') employeeId: string, @Query('status') status): Promise<{data: Review[], status: number}> {
        let idNumeric = Number.parseInt(employeeId);
        status = Number.parseInt(status);
        if (!Number.isInteger(status)) {
            status = -1;
        }
        if (Number.isInteger(idNumeric)) {
            return this._reviewService.findReviewsOfEmployee(idNumeric, status)
                .then(reviews => {
                    return {
                        data: reviews,
                        status: 0
                    };
                });
        } else {
            return Promise.reject('id not valid');
        }

    }

    @Post()
    addReview(@Body('review') reviewObj: Partial<Review>): Promise<{data: {}, status: number}> {
        return this._reviewService.add(reviewObj as Review)
            .then(() => {
                return {
                    data: {},
                    status: 0
                };
            });
    }

    @Put(':id')
    update(@Body('review') reviewObj: Review): Promise<{data: {}, status: number}> {
        if (!reviewObj.performance) {
            reviewObj.status = ReviewStatus.NEED_REVIEW;
        } else if (!reviewObj.feedback) {
            reviewObj.status = ReviewStatus.NEED_FEEDBACK;
        } else {
            reviewObj.status = ReviewStatus.DONE;
        }
        return this._reviewService.update(reviewObj as Review)
            .then(() => {
                return {
                    data: {},
                    status: 0
                };
            });
    }
}
