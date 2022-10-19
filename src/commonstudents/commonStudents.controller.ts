import { Controller, Get, Query } from "@nestjs/common";
import { CommonStudentsService } from "./commonStudents.service";
import { CommonStudentsQueryParamsDto } from "../dto/common-students-query-params.dto";
import { CommonStudentsResultDto } from "../dto/common-students-result.dto";

@Controller("api/commonstudents")
export class CommonStudentsController {
  constructor(private readonly commonStudentsService: CommonStudentsService) {}

  @Get()
  get(
    @Query() commonStudentsQueryParamsDto: CommonStudentsQueryParamsDto,
  ): Promise<CommonStudentsResultDto> {
    return this.commonStudentsService.get(commonStudentsQueryParamsDto);
  }
}
