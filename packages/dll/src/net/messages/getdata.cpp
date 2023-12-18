#include "getdata.h"
#include <chrono>
#include "../message.h"
#include "../../injector.h"
#include "../../UE/v425/uobjectarray.h"
#include "../../query/query.h"

GetDataRequest::GetDataRequest(Buffer& data) : Request(data), data(data) {}

int filter(unsigned int code, struct _EXCEPTION_POINTERS* ep)
{
	if (code == EXCEPTION_ACCESS_VIOLATION)
	{
		return EXCEPTION_EXECUTE_HANDLER;
	}
	else
	{
		return EXCEPTION_CONTINUE_SEARCH;
	};
}

bool executeQuery(QueryExecutor& executor) {
	__try
	{
		executor.processCommands();
		return true;
	}
	__except (filter(GetExceptionCode(), GetExceptionInformation()))
	{
		return false;
	}
}

void GetDataRequest::Process() {
	Buffer resBuffer;
	GetDataResponse res{ resBuffer };

	QueryExecutor executor{ data, resBuffer };

	if( !executeQuery(executor) )
		injector.log("Query caused Access Violation");

	ProcessResponse(res);
}

void GetDataResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(queryRes);
}