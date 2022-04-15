#include "getdata.h"
#include <chrono>
#include "../message.h"
#include "../../injector.h"
#include "../../UE425/uobjectarray.h"
#include "../../query/query.h"

GetDataRequest::GetDataRequest(Buffer& data) : Request(data), data(data) {}

void GetDataRequest::Process() {
	Buffer resBuffer;
	GetDataResponse res{ resBuffer };

	QueryExecutor executor{ data, resBuffer };

	auto t1 = std::chrono::high_resolution_clock::now();
	executor.processCommands();
	auto t2 = std::chrono::high_resolution_clock::now();

	/* Getting number of milliseconds as an integer. */
	auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(t2 - t1);

	injector.log("Query took " + std::to_string(ms.count()) + " ms");

	ProcessResponse(res);
}

void GetDataResponse::Process(Buffer& data) {
	Response::Process(data);

	data.Write(queryRes);
}