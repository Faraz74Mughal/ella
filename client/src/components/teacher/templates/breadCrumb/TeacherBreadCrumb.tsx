import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";

const TeacherBreadCrumb = ({
  breadCrumb
}: {
  breadCrumb?: { title: string; link?: string }[];
}) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumb?.map((bc, index) =>
          bc.link ? (
            <React.Fragment  key={bc.title}>
              <BreadcrumbItem key={bc.title}>
                <BreadcrumbLink href={bc.link}>{bc.title}</BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadCrumb.length - 1 && breadCrumb.length > 1 && (
                <BreadcrumbSeparator />
              )}
            </React.Fragment>
          ) : (
             <React.Fragment  key={bc.title}>
              <BreadcrumbItem>
                <BreadcrumbPage    umbPage>{bc.title}</BreadcrumbPage>
              </BreadcrumbItem>
              {index < breadCrumb.length - 1 && breadCrumb.length > 1 && (
                <BreadcrumbSeparator />
              )}
            </React.Fragment>
          )
        )}

      
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default TeacherBreadCrumb;
